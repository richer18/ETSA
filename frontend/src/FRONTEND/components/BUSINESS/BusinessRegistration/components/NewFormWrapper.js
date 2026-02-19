// NewFormWrapper.js
import { AddressProvider } from "./AddressContext";
import BNew from "./BNew"; // your NewForm component

const NewFormWrapper = () => (
  <AddressProvider>
    <BNew />
  </AddressProvider>
);

export default NewFormWrapper;
