import { UniversalForm, FieldConfig } from '@/components/UniversalForm';
import { CityService } from '@/lib/City';
import React from 'react'




const ManagementComponent = () => {
  const handleSubmit = (data: MyFormType) => {
    console.log("Form data", data);
  };

  return (
    <UniversalForm<MyFormType>
      fields={fields}
      schema={schema}
      onSubmit={handleSubmit}
    />
  );
}


import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  cityId: z.string().min(1),
  active: z.boolean(),
  startDate: z.string().min(1), // or z.coerce.date() for real Date
});

type MyFormType = z.infer<typeof schema>;

const fields: FieldConfig[] = [
  { name: "name", label: "Name", type: "text", required: true },
  {
    name: "cityId",
    label: "City",
    type: "select",
    required: true,
    optionsLoader: async () => {
      const cities = await new CityService().getAll();
      return cities.map((c) => ({ label: c.name, value: c.id }));
    },
  },
  { name: "active", label: "Active", type: "checkbox" },
  { name: "startDate", label: "Start Date", type: "date", required: true },
];

export default ManagementComponent