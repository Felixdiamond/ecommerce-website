import supabase from "./connSupa";

export async function registerUser(email, password) {
  const { user, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  console.log(user);
  console.log(`User ${user} created!`);
  return "success";
}

// User Login
export async function loginUser(email, password) {
  // Authenticate the user with Supabase
  const { user, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  console.log(`User ${email} logged in!`);
  return "success";
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  console.log(data);
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  window.location.reload();
  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
  console.log("User logged out!");
  return "success";
}

