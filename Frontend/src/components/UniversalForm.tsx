import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";

// Field definition
export type FieldConfig = {
    name: string;
    label: string;
    type: "text" | "select" | "checkbox" | "date";
    required?: boolean;
    optionsLoader?: () => Promise<{ label: string; value: string | number }[]>;
};

type UniversalFormProps = {
    fields: FieldConfig[];
    onSubmit: (data: Record<string, any>) => void;
    schema?: ZodType<any>; // Now optional
    defaultValues?: Record<string, any>;
};

export function UniversalForm({
    fields,
    onSubmit,
    schema,
    defaultValues = {},
}: UniversalFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        register,
        reset,
    } = useForm({
        ...(schema ? { resolver: zodResolver(schema) } : {}),
        defaultValues,
    });

    const [selectOptions, setSelectOptions] = useState<
        Record<string, { label: string; value: string | number }[]>
    >({});

    // Load all options only once on component mount
    useEffect(() => {
        const loadOptions = async () => {
            const newOptions: Record<string, { label: string; value: string | number }[]> = {};

            for (const field of fields) {
                if (field.type === "select" && field.optionsLoader) {
                    try {
                        newOptions[field.name] = await field.optionsLoader();
                    } catch (error) {
                        console.error(`Error loading options for ${field.name}:`, error);
                        newOptions[field.name] = [];
                    }
                }
            }

            setSelectOptions(newOptions);
        };

        loadOptions();
        // Empty dependency array means this effect runs once on mount
    }, []);

    // Handle default values changes
    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
                <div key={field.name} className="flex flex-col">
                    <label className="font-semibold">{field.label}</label>

                    {field.type === "text" && (
                        <input
                            type="text"
                            {...register(field.name)}
                            className="border p-2 rounded"
                        />
                    )}

                    {field.type === "date" && (
                        <input
                            type="date"
                            {...register(field.name)}
                            className="border p-2 rounded"
                        />
                    )}

                    {field.type === "checkbox" && (
                        <input
                            type="checkbox"
                            {...register(field.name)}
                            className="mt-2"
                        />
                    )}

                    {field.type === "select" && (
                        <Controller
                            name={field.name}
                            control={control}
                            render={({ field: controllerField }) => (
                                <select {...controllerField} className="border p-2 rounded">
                                    <option value="">Select...</option>
                                    {selectOptions[field.name]?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                    )}

                    {errors[field.name] && (
                        <span className="text-red-500 text-sm">
                            {(errors[field.name]?.message as string) || "Required"}
                        </span>
                    )}
                </div>
            ))}

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Submit
            </button>
        </form>
    );
}