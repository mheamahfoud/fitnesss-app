import Link from "next/link";
import { FaDumbbell, FaHeartbeat, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaHeartbeat className="text-red-300" />
              FITTRACK
            </h3>
            <p className="text-blue-100">
              Your complete fitness companion. Track workouts, monitor progress, and achieve your goals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-blue-100 hover:text-white">About Us</Link></li>
              <li><Link href="/features" className="text-blue-100 hover:text-white">Features</Link></li>
              <li><Link href="/pricing" className="text-blue-100 hover:text-white">Pricing</Link></li>
              <li><Link href="/blog" className="text-blue-100 hover:text-white">Blog</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/workouts" className="text-blue-100 hover:text-white">Workouts</Link></li>
              <li><Link href="/nutrition" className="text-blue-100 hover:text-white">Nutrition Guides</Link></li>
              <li><Link href="/trainers" className="text-blue-100 hover:text-white">Find Trainers</Link></li>
              <li><Link href="/faq" className="text-blue-100 hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <Link href="#" className="text-blue-100 hover:text-white text-xl"><FaInstagram /></Link>
              <Link href="#" className="text-blue-100 hover:text-white text-xl"><FaTwitter /></Link>
              <Link href="#" className="text-blue-100 hover:text-white text-xl"><FaYoutube /></Link>
            </div>
            <p className="text-blue-100">support@fittrack.com</p>
            <p className="text-blue-100">+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="border-t border-blue-500 mt-8 pt-6 text-center text-blue-100">
          <p>&copy; {new Date().getFullYear()} FITTRACK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}