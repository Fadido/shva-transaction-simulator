using NodaTime;
using Shva.Domain;

namespace Shva.Application;

public static class BankingHoursPolicy
{
    public const int OpensHour = 8;
    public const int ClosesHour = 18;

    public static (TransactionStatus Status, DateTime LocalTime) Evaluate(string regionCode, DateTime submittedAtUtc)
    {
        if (!Region.ToIanaTimeZone.TryGetValue(regionCode, out var zoneId))
        {
            throw new ArgumentException($"Unsupported region: {regionCode}", nameof(regionCode));
        }

        var utc = DateTime.SpecifyKind(submittedAtUtc, DateTimeKind.Utc);
        var instant = Instant.FromDateTimeUtc(utc);
        var zone = DateTimeZoneProviders.Tzdb[zoneId];
        var zoned = instant.InZone(zone);
        var local = zoned.ToDateTimeUnspecified();

        var status = zoned.Hour >= OpensHour && zoned.Hour < ClosesHour
            ? TransactionStatus.Approved
            : TransactionStatus.Rejected;

        return (status, local);
    }
}
