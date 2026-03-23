import { useRef, useState } from "react";

export function OTPInput({ onComplete }: any) {

  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(value: string, index: number) {

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    const otpString = newOtp.join("");

    if (otpString.length === 6 && !newOtp.includes("")) {
      onComplete(otpString);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  return (
    <div className="flex justify-between gap-2">

      {otp.map((digit, i) => (

        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          value={digit}
          maxLength={1}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-12 text-center border rounded-lg text-lg font-bold focus:ring-2 focus:ring-blue-600 outline-none"
        />

      ))}

    </div>
  );
}