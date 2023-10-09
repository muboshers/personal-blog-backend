import winston from "winston";
const logger = new winston.Logger({
  level: "error",
  transports: [new winston.transports.File({ filename: "error.log" })],
});

export const errorHandle = (arg) => {
  if (!arg?.err) return;
  const formatTime = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const errorMessage = `${formatTime.format(new Date())} ${arg?.err}`;

  logger.log("error", errorMessage);
  if (arg?.res)
    return arg?.res?.status(500).json({ message: "Something went wrong" });
};
