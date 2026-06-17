export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">
        My Account
      </h1>

      <div className="border rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">
          User Information
        </h2>

        <p>
          <strong>Name:</strong> {user?.name}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </div>
    </div>
  );
}