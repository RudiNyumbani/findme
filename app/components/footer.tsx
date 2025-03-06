export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-1">&copy; {new Date().getFullYear()} FindMe. All rights reserved.</p>
        <p>
          <a href="/privacy-policy" className="text-white me-3">Privacy Policy</a>
          <a href="/terms-of-service" className="text-white">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}
