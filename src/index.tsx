import { ModRegistrar } from "cs2/modding";
import TaxMod from "mods/TaxMod";

const register: ModRegistrar = (moduleRegistry) => {
    moduleRegistry.append('GameTopLeft', TaxMod);
};

export default register;
