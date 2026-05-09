using Shva.Application;
using Shva.Domain;
using Xunit;

namespace Shva.Application.Tests;

public class BankingHoursPolicyTests
{
    [Theory]
    // 09:00 UTC = 11:00 or 12:00 in Jerusalem depending on DST -> Approved
    [InlineData(Region.Israel, "2025-06-15T09:00:00Z", TransactionStatus.Approved)]
    // 23:00 UTC = 01:00 in Jerusalem -> Rejected
    [InlineData(Region.Israel, "2025-06-15T23:00:00Z", TransactionStatus.Rejected)]
    // 09:00 UTC = 18:00 in Tokyo (JST is +9, no DST) -> Rejected (boundary: 18:00 not allowed)
    [InlineData(Region.Japan, "2025-06-15T09:00:00Z", TransactionStatus.Rejected)]
    // 00:00 UTC = 09:00 in Tokyo -> Approved
    [InlineData(Region.Japan, "2025-06-15T00:00:00Z", TransactionStatus.Approved)]
    // 13:00 UTC summer = 09:00 in NYC (EDT, UTC-4) -> Approved
    [InlineData(Region.UnitedStates, "2025-07-01T13:00:00Z", TransactionStatus.Approved)]
    // 02:00 UTC = 22:00 previous day in NYC -> Rejected
    [InlineData(Region.UnitedStates, "2025-07-01T02:00:00Z", TransactionStatus.Rejected)]
    // 10:00 UTC summer = 12:00 in Paris (CEST, UTC+2) -> Approved
    [InlineData(Region.France, "2025-07-01T10:00:00Z", TransactionStatus.Approved)]
    // 17:00 UTC summer = 19:00 in Paris -> Rejected
    [InlineData(Region.France, "2025-07-01T17:00:00Z", TransactionStatus.Rejected)]
    public void Evaluate_ReturnsExpectedStatus(string region, string utcIso, TransactionStatus expected)
    {
        var instant = DateTime.Parse(utcIso, System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.AdjustToUniversal | System.Globalization.DateTimeStyles.AssumeUniversal);

        var (status, _) = BankingHoursPolicy.Evaluate(region, instant);

        Assert.Equal(expected, status);
    }

    [Fact]
    public void Evaluate_OpeningBoundary_IsApproved()
    {
        // 06:00 UTC = 08:00 in Jerusalem in winter (UTC+2) -> exactly at opening, Approved
        var instant = new DateTime(2025, 1, 15, 6, 0, 0, DateTimeKind.Utc);
        var (status, _) = BankingHoursPolicy.Evaluate(Region.Israel, instant);
        Assert.Equal(TransactionStatus.Approved, status);
    }

    [Fact]
    public void Evaluate_ClosingBoundary_IsRejected()
    {
        // 16:00 UTC = 18:00 in Jerusalem in winter (UTC+2) -> exactly at close (exclusive), Rejected
        var instant = new DateTime(2025, 1, 15, 16, 0, 0, DateTimeKind.Utc);
        var (status, _) = BankingHoursPolicy.Evaluate(Region.Israel, instant);
        Assert.Equal(TransactionStatus.Rejected, status);
    }

    [Fact]
    public void Evaluate_UnsupportedRegion_Throws()
    {
        Assert.Throws<ArgumentException>(() =>
            BankingHoursPolicy.Evaluate("XX", DateTime.UtcNow));
    }
}
