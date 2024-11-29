export default function HelpAndSupport() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Help & Support</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button className="bg-blue-500 text-white p-4 rounded-lg flex flex-col items-center">
          <svg
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>Call Support</span>
        </button>
        <button className="bg-green-500 text-white p-4 rounded-lg flex flex-col items-center">
          <svg
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>Chat with Us</span>
        </button>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow divide-y">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            Frequently Asked Questions
          </h2>
        </div>
        {[
          {
            question: "How do I update my vehicle information?",
            answer:
              "Go to Profile > Account Settings > Vehicle Information to update your vehicle details.",
          },
          {
            question: "How are earnings calculated?",
            answer:
              "Earnings are calculated based on base fare, distance, and any applicable bonuses or incentives.",
          },
          {
            question: "What should I do if I have an accident?",
            answer:
              "Immediately use the SOS button in the app and contact emergency services if needed.",
          },
          {
            question: "How do I report an issue with an order?",
            answer:
              "Use the 'Contact Support' option in the order details page to report any issues.",
          },
        ].map((faq, index) => (
          <div key={index} className="p-4">
            <h3 className="font-medium mb-2">{faq.question}</h3>
            <p className="text-gray-600 text-sm">{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* Contact Information */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">Contact Information</h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>Support: 1800-123-4567</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>Email: support@driverapp.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
