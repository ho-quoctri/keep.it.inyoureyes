export function Footer() {
  return (
    <footer className="w-full h-16 flex items-center justify-center border-t">
      <p className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} keep.it.iNyourEyes.
      </p>
    </footer>
  );
}