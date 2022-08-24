// Declare seeds as modules to prevent TS errors
declare module 'certificates.json' {
  const path: string;
  export default path;
}

declare module 'users.json' {
  const path: string;
  export default path;
}
