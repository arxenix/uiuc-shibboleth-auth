import crypto from 'crypto';
import fs from 'fs';
import { Profile, Strategy, VerifiedCallback } from '@node-saml/passport-saml';

export interface AuthenticatedShibbolethUser {
  uid: string;
  affiliations: string[];
}

const attr_map = {
  "uid": "urn:oid:0.9.2342.19200300.100.1.1",
  "eduPersonAffiliation": "urn:oid:1.3.6.1.4.1.5923.1.1.1.1"
};

function importPEMCert(path: string) {
  try {
    const certPEM = fs.readFileSync(path, 'utf8');
    const certDER = new crypto.X509Certificate(certPEM).raw.toString('base64');
    return certDER;
  } catch (err) {
    throw Error(`Failed to import PEM certificate from ${path}: ${err}`);
  }
}

export const ShibbolethStrategy = new Strategy(
  {
    callbackUrl: 'https://dev.shib.sigpwny.com/shibboleth/callback',
    entryPoint: 'https://shibboleth.illinois.edu/idp/profile/SAML2/Redirect/SSO',
    issuer: 'https://shib.sigpwny.com/shibboleth',
    // TODO: Update the IdP certificate automatically, either from:
    // - iTrust metadata: https://md.itrust.illinois.edu/itrust-metadata/itrust-metadata.xml
    // - InCommon metadata: https://mdq.incommon.org/entities/urn:mace:incommon:uiuc.edu
    // If this is implemented, ensure that the federation's metadata certificate (e.g. itrust.pem) is also added and updated regularly
    // Also: https://answers.uillinois.edu/80927
    // urn:mace:incommon:uiuc.edu
    cert: importPEMCert('../data/shibboleth/idp-cert.pem'),
    privateKey: fs.readFileSync('../data/shibboleth/sp-key.pem', 'utf8'),
    decryptionPvk: fs.readFileSync('../data/shibboleth/sp-key.pem', 'utf8'),
    signatureAlgorithm: 'sha256',
    digestAlgorithm: 'sha256',
    wantAuthnResponseSigned: true,
    wantAssertionsSigned: false, // Ideally this should be true, but the university doesn't sign assertions
    identifierFormat: null
  },
  function login(profile: Profile | null, done: VerifiedCallback) {
    if (!profile) {
      return done(Error(`No SAML response was provided`), undefined);
    }
    // Ensure that profile contains the requested attributes
    if (!profile[attr_map.uid] || !profile[attr_map.eduPersonAffiliation]) {
      return done(Error(`SAML response is missing required attributes`), undefined);
    }
    return(done(null, {
      uid: profile[attr_map.uid],
      affiliations: profile[attr_map.eduPersonAffiliation]
    }));
  },
  // TODO: Implement logout
  function logout(profile: Profile | null, done: VerifiedCallback) {
    return done(null, undefined);
  }
);

export default ShibbolethStrategy;
