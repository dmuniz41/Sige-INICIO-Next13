export type InsertClientNomenclator = {
  name: string;
  address: string | null;
  email: string | null;
  phoneNumber: string | null;
  contact: string | null;
};

export type UpdateClientNomenclator = {
  idnumber: number;
  name: string;
  address: string | null;
  email: string | null;
  phoneNumber: string | null;
  contact: string | null;
};
