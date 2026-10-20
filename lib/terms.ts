// A string is a paragraph; a string[] is a bulleted list; { subheading } is an h3.
export type TermsBlock = string | string[] | { subheading: string };

export interface TermsSection {
  heading: string;
  blocks: TermsBlock[];
}

export const termsEffectiveDate = "20 October 2026";
export const termsLastUpdated = "20 October 2026";

export const termsIntro = [
  "These Terms of Service (“Terms”) govern your access to and use of WorkPhelo, an enterprise resource planning and business management platform operated by Datrix Tech Solutions Limited (“Datrix”, “we”, “us”, or “our”).",
  "By creating an account, subscribing to, accessing, or using WorkPhelo, you agree to be legally bound by these Terms. If you do not agree to these Terms, you must not use WorkPhelo.",
];

export const termsSections: TermsSection[] = [
  {
    heading: "Definitions",
    blocks: [
      "For purposes of these Terms:",
      [
        "“WorkPhelo” means the software platform, website, applications, features, modules, APIs, and related services provided by Datrix.",
        "“Customer” means the organisation, business, or individual that subscribes to WorkPhelo.",
        "“User” means any person authorised by a Customer to access or use WorkPhelo.",
        "“Customer Data” means information, records, files, documents, employee information, financial information, business information, and other data submitted to WorkPhelo by or on behalf of the Customer.",
        "“Subscription” means the paid or free plan selected by the Customer to access WorkPhelo.",
        "“Services” means the WorkPhelo software and related services provided by Datrix.",
      ],
    ],
  },
  {
    heading: "About WorkPhelo",
    blocks: [
      "WorkPhelo is a cloud-based business management platform designed to help organisations manage various business functions.",
      "Depending on the Customer’s subscription, WorkPhelo may include modules such as:",
      [
        "Human Resources and employee management;",
        "Payroll management;",
        "Leave and attendance management;",
        "Accounting and financial management;",
        "Customer Relationship Management (CRM);",
        "Marketing management;",
        "Business operations;",
        "Reporting and analytics;",
        "Business communications;",
        "Workflow management; and",
        "Other modules or features introduced by Datrix from time to time.",
      ],
      "The features available to a Customer depend on its selected subscription plan.",
    ],
  },
  {
    heading: "Eligibility and authority",
    blocks: [
      "By using WorkPhelo, you represent that:",
      [
        "You are legally capable of entering into a binding agreement;",
        "You have authority to accept these Terms on behalf of the organisation you represent, where applicable;",
        "The information provided during registration is accurate and complete; and",
        "You will use WorkPhelo in accordance with applicable laws and regulations.",
      ],
      "Where an organisation creates an account, the organisation is responsible for ensuring that all authorised Users comply with these Terms.",
    ],
  },
  {
    heading: "Account registration",
    blocks: [
      "Certain WorkPhelo features require the Customer to create an account.",
      "The Customer agrees to:",
      [
        "Provide accurate registration information;",
        "Keep account information current;",
        "Maintain the confidentiality of login credentials;",
        "Restrict access to authorised Users;",
        "Immediately notify Datrix of suspected unauthorised access; and",
        "Take reasonable steps to protect account credentials.",
      ],
      "Customers are responsible for activities conducted through their accounts unless such activities result directly from a security failure attributable to Datrix.",
      "Datrix may require additional verification or authentication measures where reasonably necessary to protect the platform and its Users.",
    ],
  },
  {
    heading: "User access and administrators",
    blocks: [
      "Customers may create and manage User accounts according to their subscription.",
      "The Customer is responsible for:",
      [
        "Assigning appropriate permissions;",
        "Removing Users who no longer require access;",
        "Maintaining accurate User information;",
        "Protecting administrator accounts; and",
        "Ensuring Users access only information they are authorised to access.",
      ],
      "Datrix is not responsible for unauthorised access resulting from the Customer’s failure to properly manage Users, permissions, passwords, or authentication credentials.",
    ],
  },
  {
    heading: "Subscriptions and fees",
    blocks: [
      "Access to certain WorkPhelo features requires payment of subscription fees.",
      "Subscription prices, billing periods, usage limits, and included features will be communicated to the Customer during the subscription process or through the applicable WorkPhelo pricing page.",
      "Unless otherwise agreed:",
      [
        "Subscription fees are payable in advance;",
        "Fees are based on the selected plan and applicable usage levels;",
        "The Customer is responsible for applicable taxes and government charges;",
        "Subscription fees are non-refundable except where required by law or expressly stated otherwise; and",
        "Datrix may change pricing for future subscription periods by providing reasonable notice.",
      ],
      "Where a Customer has agreed to a separate written commercial agreement with Datrix, that agreement may govern pricing and payment terms where it conflicts with these Terms.",
    ],
  },
  {
    heading: "Free trials and promotional plans",
    blocks: [
      "Datrix may provide free trials, promotional subscriptions, or limited free versions of WorkPhelo.",
      "Unless otherwise stated:",
      [
        "Free trials are provided for evaluation purposes;",
        "Datrix may limit features, usage, storage, or duration;",
        "A free trial may expire automatically;",
        "Datrix may modify or discontinue promotional offers; and",
        "Customer Data associated with an expired trial may be deleted after a reasonable retention period.",
      ],
      "A free trial does not create an obligation for Datrix to provide continued free access.",
    ],
  },
  {
    heading: "Acceptable use",
    blocks: [
      "The Customer and Users must use WorkPhelo lawfully and responsibly.",
      "You must not:",
      [
        "Use WorkPhelo for unlawful, fraudulent, abusive, or malicious activities;",
        "Attempt to gain unauthorised access to WorkPhelo or another User’s account;",
        "Circumvent security, authentication, access controls, or usage restrictions;",
        "Upload malicious software, viruses, ransomware, or other harmful code;",
        "Interfere with the operation or security of WorkPhelo;",
        "Reverse engineer, decompile, disassemble, or attempt to extract the source code of WorkPhelo except where expressly permitted by applicable law;",
        "Copy, reproduce, resell, lease, sublicense, or commercially exploit WorkPhelo without Datrix’s written permission;",
        "Use WorkPhelo to infringe intellectual property, privacy, or other rights of third parties;",
        "Conduct unauthorised penetration testing, vulnerability scanning, denial-of-service testing, or other security testing against WorkPhelo;",
        "Use automated methods to overload, scrape, or excessively access the platform;",
        "Upload information that the User does not have the legal right to process; or",
        "Use WorkPhelo in a manner that could damage Datrix, WorkPhelo, other Customers, or the security or availability of the platform.",
      ],
    ],
  },
  {
    heading: "Customer Data",
    blocks: [
      "The Customer retains ownership of Customer Data submitted to WorkPhelo.",
      "The Customer grants Datrix a limited, non-exclusive right to host, process, store, transmit, and otherwise use Customer Data solely as necessary to:",
      [
        "Provide WorkPhelo;",
        "Maintain and secure the platform;",
        "Provide technical support;",
        "Perform backups and disaster recovery;",
        "Prevent fraud and security incidents;",
        "Comply with legal obligations; and",
        "Improve the Services using appropriately aggregated or anonymised information where permitted by law.",
      ],
      "Datrix does not acquire ownership of Customer Data merely because the Customer uses WorkPhelo.",
    ],
  },
  {
    heading: "Customer responsibilities for data",
    blocks: [
      "The Customer is responsible for ensuring that:",
      [
        "Customer Data is accurate and lawful;",
        "It has the necessary rights and permissions to provide the data to WorkPhelo;",
        "Appropriate notices and consents are obtained where required;",
        "Personal data is processed in accordance with applicable data protection laws; and",
        "Users only upload information that they are authorised to process.",
      ],
      "For HR and payroll functionality, the Customer remains responsible for verifying employee information, payroll inputs, tax information, statutory deductions, and other information before relying on generated results.",
    ],
  },
  {
    heading: "Data protection and privacy",
    blocks: [
      "Datrix will process personal data in accordance with applicable data protection and privacy laws.",
      "WorkPhelo may process personal information including, depending on the Customer’s use of the platform:",
      [
        "Employee information;",
        "Contact information;",
        "Payroll information;",
        "Attendance and leave information;",
        "Financial information;",
        "Customer and supplier information; and",
        "Other business-related personal data.",
      ],
      "Datrix’s handling of personal data is further described in the WorkPhelo Privacy Policy and Data Protection Policy.",
      "Where required by applicable law, the Customer may act as the data controller and Datrix may act as a data processor/service provider in relation to Customer Data.",
    ],
  },
  {
    heading: "Security",
    blocks: [
      "Datrix will implement reasonable technical and organisational measures designed to protect WorkPhelo and Customer Data against unauthorised access, loss, alteration, disclosure, or destruction.",
      "Security measures may include:",
      [
        "Access controls;",
        "Authentication mechanisms;",
        "Encryption where appropriate;",
        "Logging and monitoring;",
        "Backup procedures;",
        "Vulnerability management;",
        "Security testing;",
        "Incident response procedures; and",
        "Infrastructure security controls.",
      ],
      "However, no internet-based service can guarantee absolute security.",
      "Customers are responsible for maintaining secure passwords, controlling User access, and implementing appropriate security practices within their organisation.",
    ],
  },
  {
    heading: "Backups and data recovery",
    blocks: [
      "Datrix may maintain backups of Customer Data as part of its business continuity and disaster recovery procedures.",
      "Backups are intended to reduce the risk of permanent data loss but do not constitute an unconditional guarantee that all data can always be restored.",
      "Customers should maintain appropriate copies of critical business records where necessary.",
    ],
  },
  {
    heading: "System availability",
    blocks: [
      "Datrix will make reasonable efforts to keep WorkPhelo available and operational.",
      "However, WorkPhelo may occasionally be unavailable due to:",
      [
        "Scheduled maintenance;",
        "Emergency maintenance;",
        "Infrastructure failures;",
        "Internet or telecommunications failures;",
        "Cybersecurity incidents;",
        "Third-party service failures;",
        "Force majeure events; or",
        "Other circumstances beyond Datrix’s reasonable control.",
      ],
      "Datrix may perform maintenance or updates that temporarily affect availability.",
    ],
  },
  {
    heading: "Third-party services",
    blocks: [
      "WorkPhelo may integrate with or rely upon third-party services, including payment providers, email providers, cloud infrastructure, messaging services, analytics services, government or statutory systems, and other external platforms.",
      "Datrix is not responsible for the availability, security, functionality, or policies of third-party services that are outside Datrix’s control.",
      "Use of third-party services may be subject to separate terms and privacy policies.",
    ],
  },
  {
    heading: "Software updates and changes",
    blocks: [
      "Datrix may modify, improve, update, add, or remove WorkPhelo features from time to time.",
      "Changes may include:",
      [
        "New functionality;",
        "Security updates;",
        "Performance improvements;",
        "Interface changes;",
        "Bug fixes;",
        "Changes to integrations; and",
        "Retirement of outdated features.",
      ],
      "Where a material change significantly reduces the core functionality of a paid service, Datrix will endeavour to provide reasonable notice where practicable.",
    ],
  },
  {
    heading: "Intellectual property",
    blocks: [
      "WorkPhelo, including its software, source code, architecture, interface, designs, trademarks, logos, documentation, workflows, and other proprietary components, is owned by or licensed to Datrix.",
      "Except for the limited right to use WorkPhelo during an active Subscription, these Terms do not transfer any intellectual property rights to the Customer.",
      "The Customer must not:",
      [
        "Copy WorkPhelo;",
        "Reproduce its proprietary components;",
        "Create derivative works;",
        "Remove proprietary notices;",
        "Reverse engineer the platform except where legally permitted; or",
        "Use Datrix or WorkPhelo trademarks without permission.",
      ],
    ],
  },
  {
    heading: "Customer feedback",
    blocks: [
      "If the Customer provides suggestions, recommendations, ideas, or feedback regarding WorkPhelo, Datrix may use such feedback to improve its products and services without compensation or obligation to the Customer, provided that such use does not disclose the Customer’s confidential information.",
    ],
  },
  {
    heading: "Support",
    blocks: [
      "Datrix may provide technical support depending on the Customer’s subscription or commercial agreement.",
      "Support may be provided through email, ticketing systems, chat, telephone, documentation, or other channels designated by Datrix.",
      "Response times may vary depending on the Customer’s subscription level and the severity of the issue.",
    ],
  },
  {
    heading: "Confidentiality",
    blocks: [
      "Each party may receive confidential information belonging to the other party.",
      "The receiving party agrees to:",
      [
        "Protect confidential information using reasonable care;",
        "Use it only for purposes related to the Services; and",
        "Not disclose it to unauthorised third parties except where required by law or reasonably necessary to provide the Services.",
      ],
      "Confidential information does not include information that:",
      [
        "Is publicly available without breach of these Terms;",
        "Was already lawfully known by the receiving party;",
        "Is independently developed; or",
        "Is lawfully obtained from another source without confidentiality restrictions.",
      ],
    ],
  },
  {
    heading: "Suspension of access",
    blocks: [
      "Datrix may suspend or restrict access to WorkPhelo where reasonably necessary to:",
      [
        "Protect WorkPhelo or other Customers;",
        "Prevent security threats;",
        "Investigate suspected abuse or unlawful activity;",
        "Address a material breach of these Terms;",
        "Comply with legal or regulatory requirements; or",
        "Address overdue payments.",
      ],
      "Where reasonably practicable, Datrix will notify the Customer before or promptly after suspension and provide an opportunity to resolve the issue.",
    ],
  },
  {
    heading: "Termination",
    blocks: [
      "The Customer may terminate its Subscription in accordance with the applicable subscription terms.",
      "Datrix may terminate or suspend a Customer’s access where the Customer:",
      [
        "Materially breaches these Terms;",
        "Fails to pay applicable fees;",
        "Uses WorkPhelo unlawfully;",
        "Poses a significant security risk; or",
        "Becomes subject to insolvency or similar proceedings, where legally permitted.",
      ],
      "Upon termination, the Customer’s right to access WorkPhelo will end unless otherwise agreed.",
    ],
  },
  {
    heading: "Data after termination",
    blocks: [
      "Following termination, Datrix may retain Customer Data for a limited period in accordance with its data retention policies and applicable law.",
      "Where technically and legally possible, Customers may request an export of their Customer Data before or shortly after termination.",
      "After the applicable retention period, Datrix may permanently delete Customer Data unless retention is required by law, necessary for legitimate legal purposes, or otherwise permitted under applicable regulations.",
    ],
  },
  {
    heading: "Warranties and disclaimers",
    blocks: [
      "WorkPhelo is provided on an “as available” basis.",
      "To the maximum extent permitted by applicable law, Datrix does not guarantee that:",
      [
        "WorkPhelo will always be uninterrupted;",
        "WorkPhelo will be completely error-free;",
        "Every feature will meet every Customer requirement;",
        "All data will always be available without interruption; or",
        "The Services will be immune from every possible cybersecurity threat.",
      ],
      "Customers are responsible for evaluating WorkPhelo’s suitability for their business requirements.",
    ],
  },
  {
    heading: "Payroll, accounting and business information",
    blocks: [
      "WorkPhelo may provide calculations, reports, payroll information, accounting information, business analytics, or other automated outputs.",
      "Such outputs are provided as software-generated information and should be reviewed by appropriately qualified personnel before being used for legal, tax, accounting, payroll, financial, or regulatory decisions.",
      "Datrix does not provide legal, tax, accounting, audit, investment, or other professional advice merely by providing WorkPhelo.",
      "The Customer remains responsible for ensuring that its statutory and regulatory obligations are met.",
    ],
  },
  {
    heading: "Limitation of liability",
    blocks: [
      "To the maximum extent permitted by applicable law, Datrix will not be liable for indirect, incidental, special, consequential, punitive, or exemplary damages, including loss of profits, revenue, business opportunities, goodwill, or anticipated savings arising from the use of or inability to use WorkPhelo.",
      "Datrix’s total aggregate liability arising from a Customer’s use of WorkPhelo will, to the extent permitted by law, be limited to the amount paid by that Customer to Datrix for the affected WorkPhelo Services during the twelve (12) months immediately preceding the event giving rise to the claim.",
      "Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited under applicable law.",
    ],
  },
  {
    heading: "Indemnification",
    blocks: [
      "To the extent permitted by applicable law, the Customer agrees to indemnify and hold harmless Datrix, its directors, officers, employees, contractors, and service providers from claims, losses, damages, liabilities, and reasonable costs arising from:",
      [
        "The Customer’s unlawful use of WorkPhelo;",
        "The Customer’s breach of these Terms;",
        "Customer Data that infringes a third party’s rights;",
        "The Customer’s violation of applicable laws; or",
        "Unauthorised activities conducted through the Customer’s account resulting from the Customer’s failure to properly secure the account.",
      ],
    ],
  },
  {
    heading: "Force majeure",
    blocks: [
      "Datrix will not be liable for failure or delay in performing its obligations where such failure or delay results from circumstances beyond its reasonable control, including natural disasters, war, civil unrest, government actions, telecommunications failures, widespread internet outages, pandemics, power failures, cyberattacks, or failures of third-party infrastructure.",
    ],
  },
  {
    heading: "Governing law",
    blocks: [
      "These Terms shall be governed by and interpreted in accordance with the laws of the Republic of Ghana.",
      "The parties shall endeavour to resolve disputes through good-faith negotiation before commencing formal proceedings.",
      "Where a dispute cannot be resolved through negotiation, it shall be subject to the jurisdiction of the appropriate courts of Ghana, unless the parties agree otherwise in writing.",
    ],
  },
  {
    heading: "Changes to these Terms",
    blocks: [
      "Datrix may update these Terms from time to time.",
      "Where material changes are made, Datrix may notify Customers through WorkPhelo, email, its website, or other reasonable communication channels.",
      "The updated Terms will become effective on the date specified in the updated Terms.",
      "Continued use of WorkPhelo after the effective date of updated Terms constitutes acceptance of the revised Terms, to the extent permitted by applicable law.",
    ],
  },
  {
    heading: "Electronic communications",
    blocks: [
      "By using WorkPhelo, the Customer agrees that Datrix may communicate with the Customer electronically regarding:",
      [
        "Account administration;",
        "Subscription and billing;",
        "Security alerts;",
        "Service updates;",
        "Maintenance;",
        "Technical support;",
        "Legal notices; and",
        "Other matters relating to WorkPhelo.",
      ],
      "Electronic communications may satisfy legal requirements for written communications where permitted by applicable law.",
    ],
  },
  {
    heading: "Assignment",
    blocks: [
      "The Customer may not transfer or assign its rights or obligations under these Terms without Datrix’s prior written consent, except where such transfer is part of a lawful corporate restructuring or business transfer.",
      "Datrix may assign these Terms as part of a merger, acquisition, restructuring, sale of assets, or transfer of the WorkPhelo business.",
    ],
  },
  {
    heading: "Severability",
    blocks: [
      "If any provision of these Terms is determined to be invalid, unlawful, or unenforceable, that provision will be modified or removed to the minimum extent necessary, while the remaining provisions will continue in full force and effect.",
    ],
  },
  {
    heading: "Entire agreement",
    blocks: [
      "These Terms, together with applicable subscription agreements, order forms, privacy policies, data processing agreements, and other written agreements between the Customer and Datrix, constitute the agreement governing the Customer’s use of WorkPhelo.",
      "Where there is a conflict between these Terms and a separately signed agreement, the separately signed agreement will prevail to the extent of the conflict.",
    ],
  },
  {
    heading: "No waiver",
    blocks: [
      "Failure by Datrix to enforce any provision of these Terms does not constitute a waiver of its right to enforce that provision in the future.",
    ],
  },
  {
    heading: "Contact information",
    blocks: [
      "For questions, complaints, technical issues, or other matters relating to these Terms or WorkPhelo, please contact:",
      [
        "Datrix Tech Solutions Limited",
        "Product: WorkPhelo",
        "Website: https://workphelo.com",
        "Privacy Email: info@workphelo.com",
        "Support Email: support@workphelo.com",
        "Telephone: 0509753133",
        "Address: No. 8 ARS Avenue Ogbojo-East legon",
      ],
    ],
  },
];

export const termsAcceptance: TermsSection = {
  heading: "Customer acceptance",
  blocks: [
    "By creating a WorkPhelo account, purchasing a Subscription, clicking “I Agree”, or using WorkPhelo, the Customer confirms that:",
    [
      "It has read and understood these Terms of Service.",
      "It agrees to comply with these Terms.",
      "It has authority to accept these Terms on behalf of the organisation, where applicable.",
      "It accepts responsibility for its Users and Customer Data.",
      "It agrees to the applicable WorkPhelo Subscription and payment terms.",
    ],
  ],
};
