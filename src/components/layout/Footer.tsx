export function Footer() {
  return (
    <footer className="mt-20" style={{backgroundColor: 'var(--foreground)', color: 'var(--background)'}}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="thought-bubble mb-6" style={{backgroundColor: 'var(--foreground)', borderColor: 'var(--background)', color: 'var(--background)'}}>
            <p className="text-lg font-handwriting">
              Thanks for visiting my little corner of the internet! 🏠
            </p>
          </div>
          <p className="font-bubble opacity-80">
            © 2024 My Blog. Made with curiosity, creativity, and warm cocoa ☕
          </p>
        </div>
      </div>
    </footer>
  );
}