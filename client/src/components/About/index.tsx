import { getServiceProviderInfo } from "@/utils/api";

export default async function About() {
  const owner = await getServiceProviderInfo();
  const owner_link = owner.link ? (
    owner.link.match(/^(http|https):\/\//) ? owner.link : null
  ) : null;
  return (
    <div className="panel">
      <p>
        This service is operated by {owner_link ? (
          <a href={owner_link} target="_blank" rel="noopener">
            {owner.name}
          </a>
        ) : owner.name}.
        {owner.email ? 
          <span>
            &nbsp;If you have any questions or issues, please contact the operator at&nbsp;
            <a href={`mailto:${owner.email}`} target="_blank" rel="noopener">{owner.email}</a>.
          </span>
        : null}
      </p>
      <br />
      <p>
        Shibboleth Link is open source on&nbsp;
        <a href="https://github.com/sigpwny/shibboleth-auth" target="_blank" rel="noopener">GitHub</a>.
      </p>
    </div>
  );
}
