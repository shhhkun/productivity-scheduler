export default function AuthScreen({
  loginEmail,
  setLoginEmail,
  loginPass,
  setLoginPass,
  logIn,
  signUp,
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-gray-100 p-4">
      <h2 className="text-2xl mb-4">Sign In</h2>

      <input
        type="email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        placeholder="Email"
        className="mb-2 p-2 rounded bg-gray-800 border border-gray-600 text-gray-100 w-64"
      />
      <input
        type="password"
        value={loginPass}
        onChange={(e) => setLoginPass(e.target.value)}
        placeholder="Password"
        className="mb-4 p-2 rounded bg-gray-800 border border-gray-600 text-gray-100 w-64"
      />

      <div className="flex flex-col items-center gap-1 w-64">
        <button
          onClick={() => logIn(loginEmail, loginPass)}
          style={{
            backgroundColor: 'rgb(167, 243, 208)',
            color: 'rgb(17, 24, 39)',
            borderRadius: '8px',
            padding: '12px 24px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            minWidth: '120px',
            marginBottom: '12px',
          }}
        >
          Sign In
        </button>

        <button
          onClick={() => signUp(loginEmail, loginPass)}
          className="text-gray-400 underline text-sm hover:text-gray-200"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
