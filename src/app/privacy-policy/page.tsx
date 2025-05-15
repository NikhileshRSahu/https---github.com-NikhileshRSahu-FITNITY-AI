export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 text-primary-foreground">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-invert max-w-none space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold">1. Introduction</h2>
        <p>
          Welcome to Fitnity AI. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
        </p>

        <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
        <p>
          We collect personal information that you voluntarily provide to us when you register on the Fitnity AI, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Fitnity AI or otherwise when you contact us.
        </p>
        <p>
          The personal information that we collect depends on the context of your interactions with us and the Fitnity AI, the choices you make and the products and features you use. The personal information we collect may include the following:
        </p>
        <ul>
          <li>Personal Information Provided by You. We collect names; email addresses; usernames; passwords; contact preferences; contact or authentication data; billing addresses; debit/credit card numbers; phone numbers; and other similar information.</li>
          <li>Fitness and Health Data. We may collect data related to your fitness activities, goals, body measurements, workout history, sleep, water intake, and nutrition.</li>
        </ul>

        <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
        <p>
          We use personal information collected via our Fitnity AI for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
        </p>
        <ul>
          <li>To facilitate account creation and logon process.</li>
          <li>To post testimonials.</li>
          <li>Request feedback.</li>
          <li>To enable user-to-user communications.</li>
          <li>To manage user accounts.</li>
          <li>To send administrative information to you.</li>
          <li>To protect our Services.</li>
          <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
          <li>To respond to legal requests and prevent harm.</li>
          <li>Fulfill and manage your orders.</li>
          <li>To deliver and facilitate delivery of services to the user.</li>
          <li>To respond to user inquiries/offer support to users.</li>
          <li>To send you marketing and promotional communications.</li>
          <li>Deliver targeted advertising to you.</li>
        </ul>

        <h2 className="text-2xl font-semibold">4. Will Your Information Be Shared With Anyone?</h2>
        <p>
          We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
        </p>
        
        <h2 className="text-2xl font-semibold">5. How Long Do We Keep Your Information?</h2>
        <p>
          We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.
        </p>

        <h2 className="text-2xl font-semibold">6. How Do We Keep Your Information Safe?</h2>
        <p>
          We aim to protect your personal information through a system of organizational and technical security measures.
        </p>

        <h2 className="text-2xl font-semibold">7. What Are Your Privacy Rights?</h2>
        <p>
          In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information.
        </p>

        <h2 className="text-2xl font-semibold">8. Controls for Do-Not-Track Features</h2>
        <p>
          Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.
        </p>

        <h2 className="text-2xl font-semibold">9. Updates to This Notice</h2>
        <p>
          We may update this privacy notice from time to time. The updated version will be indicated by an updated “Revised” date and the updated version will be effective as soon as it is accessible.
        </p>

        <h2 className="text-2xl font-semibold">10. Contact Us</h2>
        <p>
          If you have questions or comments about this notice, you may email us at support@fitnity.ai.
        </p>
      </div>
    </div>
  );
}
