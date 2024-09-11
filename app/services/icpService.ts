import { ICP } from "../types/icp";

const ICP_STORAGE_KEY = "icps";

export const icpService = {
  getICPs: (): ICP[] => {
    const icpsJson = localStorage.getItem(ICP_STORAGE_KEY);
    return icpsJson ? JSON.parse(icpsJson) : [];
  },

  addICP: (icp: ICP): void => {
    const icps = icpService.getICPs();
    icps.push({ ...icp, id: Date.now().toString() });
    localStorage.setItem(ICP_STORAGE_KEY, JSON.stringify(icps));
  },

  updateICP: (updatedICP: ICP): void => {
    const icps = icpService.getICPs();
    const index = icps.findIndex((icp) => icp.id === updatedICP.id);
    if (index !== -1) {
      icps[index] = updatedICP;
      localStorage.setItem(ICP_STORAGE_KEY, JSON.stringify(icps));
    }
  },

  deleteICP: (id: string): void => {
    const icps = icpService.getICPs();
    const updatedICPs = icps.filter((icp) => icp.id !== id);
    localStorage.setItem(ICP_STORAGE_KEY, JSON.stringify(updatedICPs));
  },
};
