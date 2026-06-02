export const  ContactSection = () => {
  return (
    <section className="contact-section h-auto">
      <p className="mt-2 text-2xl font-semibold font-primary">If you have any questions or need general information, feel free to reach out to us.</p>
      <div className="ContactInfo mt-8 text-lg font-primary">
        <div className="contact-phone flex justify-between items-center border-b-2 border-primary">
          <div>PHONE</div>
          <div>(+84) 836 229 718</div>
        </div>
        <div className="contact-email flex justify-between items-center border-b-2 border-primary">
          <div>EMAIL</div>
          <div>info@example.com</div>
        </div>
      </div>
    </section>
  );
}