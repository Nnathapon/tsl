function Terms() {
  return (
    <div className="w-full text-left max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-green-100 dark:border-green-900 p-8">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">Terms of Service</h1>
        <p className="mb-2 text-sm text-white dark:text-white">Last Updated: 1 September 2025</p>
        <ol className="space-y-4 list-decimal ml-6">
          <li>
            <b>Acceptance of Terms</b><br />
            By accessing or using the Service, you agree to be bound by these Terms of Service and our Privacy Policy.
          </li>
          <li>
            <b>User Accounts</b>
            <ul className="list-disc ml-6">
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must provide accurate and complete information during registration and keep it updated.</li>
              <li>TSL Asset reserves the right to suspend or terminate accounts that provide false information or are used for fraudulent activity.</li>
            </ul>
          </li>
          <li>
            <b>User Responsibilities (Rules of Conduct)</b>
            <ul className="list-disc ml-6">
              <li>Do not post false, misleading, or fraudulent property listings.</li>
              <li>Do not harass, spam, or harm other users.</li>
              <li>Do not violate any applicable laws or regulations.</li>
              <li>Do not upload any content that is illegal, infringing, or offensive.</li>
            </ul>
          </li>
          <li>
            <b>Intellectual Property</b>
            <ul className="list-disc ml-6">
              <li>TSL Asset owns the platform's design, code, and branding.</li>
              <li>You retain ownership of the content you post but grant TSL Asset a license to display and distribute that content on the Service.</li>
            </ul>
          </li>
          <li>
            <b>Transactions and Payments</b>
            <ul className="list-disc ml-6">
              <li>TSL Asset facilitates connections but is not a party to transactions between buyers and sellers.</li>
              <li>All financial transactions are processed by secure third-party payment gateways. We are not liable for payment processing issues.</li>
              <li>Fees for promoted listings are non-refundable.</li>
            </ul>
          </li>
          <li>
            <b>Disclaimer of Warranties</b><br />
            The Service is provided "as is" and "as available" without any warranties, express or implied. TSL Asset does not guarantee the accuracy of listings or the quality of properties.
          </li>
          <li>
            <b>Limitation of Liability</b><br />
            TSL Asset shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service or inability to conduct a transaction.
          </li>
          <li>
            <b>Governing Law</b><br />
            These Terms are governed by the laws of Thailand.
          </li>
          <li>
            <b>Changes to Terms</b><br />
            We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.
          </li>
        </ol>
    </div>
  );
}

export default Terms;