namespace Shva.Domain;

public static class Region
{
    public const string Israel = "IL";
    public const string France = "FR";
    public const string UnitedStates = "US";
    public const string Japan = "JP";

    public static readonly IReadOnlyDictionary<string, string> ToIanaTimeZone =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            [Israel] = "Asia/Jerusalem",
            [France] = "Europe/Paris",
            [UnitedStates] = "America/New_York",
            [Japan] = "Asia/Tokyo"
        };

    public static bool IsSupported(string code) => ToIanaTimeZone.ContainsKey(code);
}
