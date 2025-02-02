// "use client";
import About from "@/components/About";
import Dropdown from "@/components/Dropdown";
import Provider from "@/components/Provider";

// TODO: Get Discord server ID from GET query parameter

export default function SetupPage() {
  return (
    <div className="container px-4">
      <div className="max-w-lg mx-auto pt-8 flex flex-col gap-4">
        <div className="text-center font-bold">
          <h1 className="text-4xl">Shibboleth Link</h1>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg">
            Link accounts to receive roles for the below Discord server!
          </p>
          <div className="panel w-full">
            <div className="flex flex-row gap-2 items-center">
              <span className="flex grow-0 shrink-0 size-8 bg-gray-300 rounded-full"></span>
              <p><span className="font-bold">Illinois Esports</span> (<span className="font-mono">1234567890</span>)</p>
            </div>
            <hr className="border-1 my-2 border-surface-150" />
            <span className="text-sm flex flex-col gap-1">
              <p>
                This Discord server is <span className="font-bold">verified</span> and part of the safety program. The info below will be stored and shared with the owners of this Discord server:
              </p>
              <ul className="list-disc list-inside">
                <li>UIUC NetID</li>
                <li>UIUC Affiliation (e.g. student, alum, staff)</li>
                <li>Discord Username and ID</li>
              </ul>
              <p>
                You can always unlink your account if you decide to leave. Please review the <a href="https://sigpwny.com/privacy#shibboleth" target="_blank" rel="noopener">Privacy Policy</a> and <a href="#" target="_blank" rel="noopener">FAQ</a> to understand how your info is shared.
              </p>
            </span>
          </div>
          <div className="panel w-full">
            <div className="flex flex-row gap-2 items-center">
              <span className="flex grow-0 shrink-0 size-8 bg-gray-300 rounded-full"></span>
              <p><span className="font-bold">SIGma</span> (<span className="font-mono">1234567890</span>)</p>
            </div>
            <hr className="border-1 my-2 border-surface-150" />
            <span className="text-sm flex flex-col gap-1">
              <p>
                Your info will <span className="font-bold">not</span> be stored or shared with the owners of this Discord server.
              </p>
            </span>
          </div>
        </div>
        <span className="self-center size-8 rounded-full border-surface-150 border-2 bg-surface-100 text-gray-400 select-none text-center items-center font-bold">+</span>
        <div className="flex flex-col gap-2 items-center">
          <div className="panel w-full flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Provider
              primary_text="University of Illinois Urbana-Champaign"
              secondary_text="NetID, Affiliation"
            />
            <button className="h-fit text-center select-none text-black bg-gray-100 hover:bg-gray-300 px-4 py-2 mb-1 sm:mb-0 rounded-xl">
              <span>Sign in</span>
            </button>
          </div>
          <div className="panel w-full flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Provider
              primary_text="Discord"
              secondary_text="Username and ID"
            />
            <button className="h-fit text-center select-none text-black bg-gray-100 hover:bg-gray-300 px-4 py-2 mb-1 sm:mb-0 rounded-xl">
              Sign in
            </button>
          </div>
        </div>
        {/* <button>
          Review data
        </button> */}
        <p className="mt-4">
          By submitting, you confirm that you have read and agree to the <a href="https://sigpwny.com/privacy#shibboleth" target="_blank" rel="noopener">Privacy Policy</a> for Shibboleth Link.
        </p>
        <button className="text-lg text-center select-none text-black bg-primary hover:bg-secondary w-full px-4 py-2 rounded-xl">
          Submit and Link
        </button>
      </div>
    </div>
  );
}
