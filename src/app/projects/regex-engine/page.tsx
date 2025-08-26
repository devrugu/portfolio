import RegexEngineDemo from "@/components/RegexEngineDemo";

export default function RegexEnginePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-2">Live Regex Engine Demo</h1>
      <p className="text-lg text-gray-400 mb-8">
        An interactive demonstration of converting a regular expression into an NFA and DFA, based on Thompson's Construction and Subset Construction algorithms.
      </p>
      <RegexEngineDemo />
    </div>
  );
}