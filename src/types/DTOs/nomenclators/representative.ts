export type InsertRepresentativeNomenclator = {
  name: string;
  address: string | null;
  email: string | null;
  phoneNumber: string;
  contact: string | null;
  percentage: number;
};

export type UpdateRepresentativeNomenclator = {
  idNumber: number;
  name: string;
  address: string | null;
  email: string | null;
  phoneNumber: string;
  contact: string | null;
  percentage: number;
};
