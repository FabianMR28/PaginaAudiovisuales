


document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  const isRegisterPage = window.location.pathname.includes("registro.html");
  const isLoginPage = window.location.pathname.includes("login.html");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email")?.value.trim().toLowerCase();
    const password = document.getElementById("password")?.value;

    if (isRegisterPage) {
      const nombres = document.getElementById("nombres")?.value.trim();
      const apellidos = document.getElementById("apellidos")?.value.trim();
      const confirmPassword = document.getElementById("confirm-password")?.value;

      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }

      let users = JSON.parse(localStorage.getItem("usuariosCamPro") || "[]");

      if (users.some(user => user.email === email)) {
        alert("Este correo ya está registrado.");
        return;
      }

      users.push({ nombres, apellidos, email, password });
      localStorage.setItem("usuariosCamPro", JSON.stringify(users));

      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "login.html";

    } else if (isLoginPage) {
      const users = JSON.parse(localStorage.getItem("usuariosCamPro") || "[]");

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("usuarioActivo", JSON.stringify(user));
        alert(`Bienvenido, ${user.nombres}`);
        window.location.href = "index.html";
      } else {
        alert("Correo o contraseña incorrectos.");
      }
    }
  });
});

