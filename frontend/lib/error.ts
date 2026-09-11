// JanSetu AI - API Error Formatting Utility

/**
 * Formats API errors (including FastAPI/Pydantic 422 validation errors)
 * into clean, human-readable strings, preventing '[object Object]' rendering.
 */
export function formatApiError(errorData: any, status: number): string {
  if (!errorData) {
    return `API request failed with status ${status}`;
  }

  // 1. If detail is a plain string
  if (typeof errorData.detail === "string" && errorData.detail.trim()) {
    return errorData.detail;
  }

  // 2. If detail is an array of FastAPI / Pydantic validation errors
  if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
    const messages = errorData.detail
      .map((item: any) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          // loc is typically ["body", "raw_text"]
          const loc = Array.isArray(item.loc)
            ? item.loc.filter((part: any) => part !== "body").join(".")
            : "";
          const msg = item.msg || "Invalid input";
          return loc ? `${loc}: ${msg}` : msg;
        }
        return String(item);
      })
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join("; ");
    }
  }

  // 3. If standard message property exists
  if (typeof errorData.message === "string" && errorData.message.trim()) {
    return errorData.message;
  }

  return `API request failed with status ${status}`;
}
