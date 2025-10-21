function Privacy() {
  return (
    <div className="w-full text-left max-w-2xl bg-white dark:bg-gray-800 text-white rounded-2xl shadow-2xl border border-green-100 dark:border-green-900 p-8">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">Privacy Policy</h1>
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Last Updated: 1 September 2025</p>
        <ol className="space-y-4 list-decimal ml-6">
          <li>
            <b>Information We Collect</b>
            <ul className="list-disc ml-6">
              <li>
                <b>Information You Provide:</b> Registration data (name, email, phone number, password), profile details, property listings, payment info, and communications.
              </li>
              <li>
                <b>Information Collected Automatically:</b> Device data (IP, browser type) and usage data (properties viewed, searches) via cookies and similar technologies.
              </li>
            </ul>
          </li>
          <li>
            <b>How We Use Your Information</b>
            <ul className="list-disc ml-6">
              <li>Provide, maintain, and improve the Service.</li>
              <li>Facilitate communication between users.</li>
              <li>Process transactions and send confirmations.</li>
              <li>Personalize your experience.</li>
              <li>Send administrative alerts and (with consent) marketing communications.</li>
              <li>Detect and prevent fraud and abuse.</li>
            </ul>
          </li>
          <li>
            <b>How We Share Your Information</b>
            <ul className="list-disc ml-6">
              <li>
                <b>With Other Users:</b> Profile name, phone, and listed properties are visible to facilitate transactions.
              </li>
              <li>
                <b>With Service Providers:</b> Data shared with trusted vendors for hosting, payments, analytics, and email delivery.
              </li>
              <li>
                <b>For Legal Reasons:</b> Disclosure if required by law or to protect rights.
              </li>
              <li>We do not sell your personal information to third-party advertisers.</li>
            </ul>
          </li>
          <li>
            <b>Your Rights & Choices</b>
            <ul className="list-disc ml-6">
              <li>Access and update your info in account settings.</li>
              <li>Opt-out of marketing emails via unsubscribe link.</li>
              <li>Adjust browser settings to refuse cookies.</li>
            </ul>
          </li>
          <li>
            <b>Data Security</b><br />
            Industry-standard security (SSL, hashed passwords) is used, but no method is 100% secure.
          </li>
          <li>
            <b>Data Retention</b><br />
            Personal info is retained as long as your account is active or as needed for the Service, legal obligations, and dispute resolution.
          </li>
          <li>
            <b>Children's Privacy</b><br />
            Service not intended for children under 18; we do not knowingly collect data from children.
          </li>
          <li>
            <b>Changes to This Policy</b><br />
            We may update this policy and will notify you of material changes by posting the new policy on the Site.
          </li>
        </ol>
    </div>
  );
}

export default Privacy;