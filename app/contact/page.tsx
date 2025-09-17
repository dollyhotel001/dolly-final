import Layout from "@/components/Layout";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
} from "lucide-react";

export default function ContactPage() {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re here to help make your stay unforgettable. Reach out to
              us for reservations, inquiries, or any special requests.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Details */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-yellow-600 p-2 rounded-lg mr-4">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Address
                      </h3>
                      <p className="text-gray-600 text-sm">
                        1no. Netaji Park , G.t.ROad (Dolly Pharmacy){" "}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Bandel, Hooghly, 712123
                      </p>
                      <p className="text-gray-600 text-sm">India</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-yellow-600 p-2 rounded-lg mr-4">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Phone Numbers
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Main: +91 8777659544
                      </p>
                      <p className="text-gray-600 text-sm">
                        Reservations: +91 8777651011
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-yellow-600 p-2 rounded-lg mr-4">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Email
                      </h3>
                      <p className="text-gray-600 text-sm">
                        General: dollyhotelbandel@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-yellow-600 p-2 rounded-lg mr-4">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Reception Hours
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Check-in: 10:00 AM
                      </p>
                      <p className="text-gray-600 text-sm">
                        Check-out: 9:30 AM
                      </p>
                      <p className="text-gray-600 text-sm">
                        Hourly Booking Ends At: 7:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Services */}
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Quick Services
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm text-gray-600">Free Wi-Fi</span>
                    </div>
                    <div className="flex items-center">
                      <Car className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm text-gray-600">Parking</span>
                    </div>

                    <div className="flex items-center">
                      <Coffee className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm text-gray-600">
                        24/7 Room Service
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div>
                <div className="bg-gray-100 rounded-lg h-80 mb-6">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14601.867036336365!2d88.27886361822713!3d23.07806519369911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8f22c52312f91%3A0x33c46572a7c77f96!2sPandua%2C%20West%20Bengal%20712149!5e0!3m2!1sen!2sin!4v1691750706434!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Send us a Message
              </h2>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Your first name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Your last name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="reservation">Reservation Inquiry</option>
                    <option value="general">General Information</option>
                    <option value="event">Event Planning</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Please tell us how we can help you..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    className="bg-yellow-600 text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors duration-200"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-yellow-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="text-xl text-yellow-100 mb-8">
              Our 24/7 concierge team is always ready to help
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+918777659544"
                className="bg-white text-yellow-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                Call Now: +91 8777659544
              </a>
              <a
                href="mailto:dollyhotelbandel@gmail.com"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-yellow-600 transition-colors duration-200"
              >
                Email Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
