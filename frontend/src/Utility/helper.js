export function cn(class1 = "", class2 = "") {
  class1 = class1?.trim();
  class2 = class2?.trim();

  // Join the two class strings together with a space
  return `${class1} ${class2}`;
}

export function getColor(value) {
  if (Number(value) > 0) return "green";
  else return "red";
}

export function startLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
}

export function stopLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
}
