const isAnyEmptyOrNull = (object: object) => {
  console.log({
    object,
  });
  for (let item in object) {
    if (!object[item as keyof object]) {
      console.log(
        `El atributo ${object[item as keyof object]} esta implicitamente falso`
      );
      return true;
    }
    return false;
  }
};

export { isAnyEmptyOrNull };
