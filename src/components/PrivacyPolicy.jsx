import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      {/* Fixed Navigation Header */}
      <div className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm py-4 px-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-indigo-300" />
                <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                <span className="font-bold text-xl text-gray-900">𝘈
                </span>
                </div>
              </div>
              <Link to="/">
                <span className="font-extrabold text-2xl text-gray-800 tracking-tight">
                  Aesthetix
                </span>
              </Link>
            </div>
            <Link to="/">
              <button className="bg-gradient-to-r from-purple-300 to-indigo-300 text-gray-800 font-medium py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content with Padding for Fixed Header */}
      <div className="container mx-auto pt-24 p-6 max-w-4xl">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-6 shadow-md">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">
            Privacy Policy for Aesthetix
          </h1>
          <p className="text-gray-400 text-sm mb-8 text-center">
            Last Updated: April 5, 2025
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-3 text-gray-800">Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to Aesthetix, an aesthetic text and image editing application ("App"). This Privacy Policy outlines how we handle your data when you use Aesthetix. We are committed to safeguarding your privacy and minimizing data collection to what is strictly necessary for the App’s functionality.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                By using Aesthetix, you consent to the practices described in this Privacy Policy. Please read it carefully to understand our approach.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-gray-800">Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed">
                We prioritize your privacy and collect only the following information:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 leading-relaxed">
                <li><strong>Email Address</strong>: If you choose to create an account, we collect your email address for authentication and account management purposes. This is optional and only applies if you log in.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-2">
                We <strong>do not</strong> collect or store:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 leading-relaxed">
                <li>Your images or text content</li>
                <li>Usage data or analytics (e.g., how you use the App)</li>
                <li>Device information (e.g., model, OS version)</li>
                <li>Location data</li>
                <li>Any other personally identifiable information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-gray-800">How We Process Your Data</h2>
              <p className="text-gray-600 leading-relaxed">
                Aesthetix processes all image and text editing <strong>locally on your device</strong>. This means:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 leading-relaxed">
                <li>Your images and text remain on your device and are not uploaded to our servers.</li>
                <li>No data is transmitted to us unless you explicitly save or share your edited content using your device’s native sharing features (e.g., email, social media), which is entirely under your control.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-gray-800">Use of Your Email Address</h2>
              <p className="text-gray-600 leading-relaxed">
                If you provide an email address by creating an account, we use it solely for:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 leading-relaxed">
                <li>Account authentication and login</li>
                <li>Sending password reset emails (if requested)</li>
                <li>Delivering critical service announcements (e.g., updates to this Privacy Policy)</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-2">
                We will not:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 leading-relaxed">
                <li>Use your email for marketing or promotional purposes</li>
                <li>Share your email with third parties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-gray-800">App Permissions</h2>
              <p className="text-gray-600 leading-relaxed">
                Aesthetix requires minimal permissions to operate:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 leading-relaxed">
                <li><strong>Photo Library Access</strong>: Necessary to allow you to select images from your device for editing.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-2">
                This permission is used exclusively to enable the App’s core functionality. We do not access, store, or transmit your images beyond what you choose to edit within the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-gray-800">Third-Party Services</h2>
              <p className="text-gray-600 leading-relaxed">
                Aesthetix operates independently and does not integrate with third-party analytics, advertising, or data collection services. We do not share any user information with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-gray-800">Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                Although we collect minimal data, we implement reasonable security measures to protect your email address (if provided) from unauthorized access, use, or disclosure. These measures include encryption and secure storage practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-gray-800">Children’s Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Aesthetix is not intended for use by children under the age of 13 (or the applicable age in your jurisdiction). We do not knowingly collect personal information from children. If we become aware that a child under 13 has provided us with information, we will delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-gray-800">Changes to This Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant updates by posting the revised policy here and updating the "Last Updated" date. We encourage you to review this page occasionally.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-gray-800">Your Rights</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have an account with Aesthetix, you have the right to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 leading-relaxed">
                <li>Access the information we hold about you (i.e., your email address)</li>
                <li>Request corrections to your email address</li>
                <li>Delete your account and associated email address</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-2">
                To exercise these rights, please contact us using the details below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-gray-800">Legal Basis and Jurisdiction</h2>
              <p className="text-gray-600 leading-relaxed">
                Our data practices comply with applicable privacy laws. This Privacy Policy is governed by the laws of [Your Country/State]. Any disputes will be resolved under this jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-gray-800">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out to us at:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 leading-relaxed">
                <li><strong>Email</strong>: pratappawar8698567744@gmail.com.com</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-2">
                We aim to respond to all inquiries within 7 business days.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;