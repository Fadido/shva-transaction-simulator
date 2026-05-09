namespace Shva.Domain;

public class Transaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserId { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public DateTime SubmittedAtUtc { get; set; }
    public DateTime LocalTime { get; set; }
    public TransactionStatus Status { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
