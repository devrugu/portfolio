"use client";

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'email' | 'tel';
  as?: 'input' | 'textarea';
}

export default function FormInput({ label, name, value, onChange, type = 'text', as = 'input' }: FormInputProps) {
  const commonProps = {
    id: name,
    name,
    value,
    onChange,
    className: "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
  };

  return (
    <div>
      <label htmlFor={name} className="block text-on-background mb-1">{label}</label>
      {as === 'textarea' ? (
        <textarea {...commonProps} rows={4} />
      ) : (
        <input type={type} {...commonProps} />
      )}
    </div>
  );
}