import { Loader2 } from "lucide-react";

const Loading = ({ fullScreen = true, text = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2
          className="
            text-primary animate-spin
            w-8 h-8 landscape:w-6 landscape:h-6
            sm:w-10 sm:h-10
            lg:w-12 lg:h-12
          "
        />
        <p
          className="
            mt-3 text-gray-500
            text-sm landscape:text-xs
            lg:mt-4 lg:text-base
          "
        >
          {text}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 landscape:p-4 lg:p-8">
      <Loader2 className="w-6 h-6 landscape:w-5 landscape:h-5 lg:w-8 lg:h-8 text-primary animate-spin" />
      <p className="mt-2 text-gray-500 text-xs landscape:text-[10px] lg:text-sm">
        {text}
      </p>
    </div>
  );
};

export default Loading;
