import Link from 'next/link';

export default function Terms() {
    return (
        <div className='w-full h-full flex flex-col items-center justify-center bg-zinc-950'>
            <div className='max-w-3xl py-24 pb-32 p-6 text-zinc-200'>
                <Link
                    href='/'
                    className='text-zinc-200 bg-gradient-to-tr from-blue-600 to-blue-500 hover:contrast-150 transition-all duration-300 shadow-inner shadow-blue-300/35  px-4 py-2 rounded-full'
                >
                    Back to Home
                </Link>
                <h1 className='text-3xl font-bold mb-6 mt-6'>
                    Terms of Service for Naturl
                </h1>
                <p className='text-sm mb-4'>
                    Effective Date: December 22, 2024
                </p>

                <h2 className='text-xl font-semibold mt-6 mb-3'>
                    1. Acceptance of Terms
                </h2>
                <p className='mb-4'>
                    By using Naturl (&quot;the Service&quot;), you agree to
                    these Terms of Service. If you do not agree, you may not use
                    the Service. The Service is provided by Naturl
                    (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
                </p>

                <h2 className='text-xl font-semibold mt-6 mb-3'>
                    2. Description of Service
                </h2>
                <p className='mb-4'>
                    Naturl is a free URL shortener that allows users to convert
                    long URLs into shorter links, either with a custom shortcode
                    or a randomly generated one. No signup is required, and the
                    Service is available to all users at no cost.
                </p>
                <h2 className='text-xl font-semibold mt-6 mb-3'>
                    3. Security and Abuse Prevention
                </h2>
                <p className='mb-4'>
                    To protect our users and maintain the integrity of our
                    Service, we take the following security measures:
                </p>
                <ul className='list-disc pl-6 mb-4 space-y-2'>
                    <li>
                        All submitted URLs are automatically checked against
                        Google Safe Browsing APIs to identify and block
                        potentially malicious links, including those associated
                        with phishing, malware, or unwanted software.
                    </li>
                    <li>
                        We implement IP-based rate limiting to prevent spam and
                        abuse of our Service. This helps ensure fair usage and
                        availability for all users.
                    </li>
                </ul>

                <h2 className='text-xl font-semibold mt-6 mb-3'>
                    4. User Responsibilities
                </h2>
                <p className='mb-2'>When using the Service, you agree to:</p>
                <ul className='list-disc pl-6 mb-4 space-y-2'>
                    <li>
                        Provide only legitimate URLs that comply with all
                        applicable laws and regulations.
                    </li>
                    <li>
                        Refrain from using the Service for any malicious,
                        harmful, or unlawful purposes, including but not limited
                        to phishing, spamming, spreading malware, or creating
                        links to illegal content.
                    </li>
                    <li>
                        Avoid creating links that could harm the reputation of
                        Naturl.
                    </li>
                </ul>

                <h2 className='text-xl font-semibold mt-6 mb-3'>
                    5. Prohibited Uses
                </h2>
                <p className='mb-2'>You may not use the Service to:</p>
                <ul className='list-disc pl-6 mb-4 space-y-2'>
                    <li>
                        Host or distribute malicious content, such as viruses,
                        spyware, or malware.
                    </li>
                    <li>
                        Link to illegal, abusive, or otherwise objectionable
                        material.
                    </li>
                    <li>
                        Mislead or deceive users, including impersonation or
                        phishing schemes.
                    </li>
                    <li>
                        Engage in any activity that violates the rights of
                        others or applicable laws.
                    </li>
                </ul>

                <h2 className='text-xl font-semibold mt-6 mb-3'>
                    6. Disclaimer of Liability
                </h2>
                <p className='mb-4'>
                    We do not monitor, verify, or endorse the content of URLs
                    shortened through the Service. As such, we are not
                    responsible for any misuse or malicious use of the Service.
                </p>
                <p className='mb-2'>By using the Service, you agree that:</p>
                <ul className='list-disc pl-6 mb-4 space-y-2'>
                    <li>
                        We are not liable for any damages resulting from the use
                        or inability to use the Service.
                    </li>
                    <li>
                        We are not responsible for any harm caused by shortened
                        URLs created through the Service.
                    </li>
                </ul>

                <h2 className='text-xl font-semibold mt-6 mb-3'>
                    7. Limitation of Liability
                </h2>
                <p className='mb-4'>
                    To the fullest extent permitted by law, Naturl and its
                    operators will not be liable for any indirect, incidental,
                    special, consequential, or punitive damages arising from
                    your use of the Service.
                </p>

                <h2 className='text-xl font-semibold mt-6 mb-3'>
                    8. Termination of Service
                </h2>
                <p className='mb-4'>
                    We reserve the right to modify, suspend, or terminate the
                    Service at any time without prior notice. We may also
                    restrict access to the Service for users who violate these
                    Terms of Service.
                </p>

                <h2 className='text-xl font-semibold mt-6 mb-3'>
                    9. Modifications to Terms
                </h2>
                <p className='mb-4'>
                    We reserve the right to update or modify these Terms of
                    Service at any time. Any changes will be effective
                    immediately upon posting on our website or application.
                    Continued use of the Service constitutes your acceptance of
                    the revised terms.
                </p>

                <h2 className='text-xl font-semibold mt-6 mb-3'>
                    10. Governing Law
                </h2>
                <p className='mb-4'>
                    These Terms of Service are governed by and construed in
                    accordance with the laws of your applicable jurisdiction,
                    without regard to its conflict of law principles.
                </p>

                <p className='mt-8 text-sm text-zinc-400'>
                    By using Naturl, you acknowledge that you have read,
                    understood, and agreed to these Terms of Service.
                </p>
            </div>
        </div>
    );
}
