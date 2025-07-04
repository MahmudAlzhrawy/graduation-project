export default function PaymentSuccess({ searchParams }) {
  const amount = searchParams?.amount || "0.00";

  return (
    <main className="w-full p-10 text-white text-center border rounded-md bg-gradient-to-tr from-blue-500 to-purple-500 h-[950px] flex justify-center items-center">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>

        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          ${amount}
        </div>
      </div>
    </main>
  );
}
