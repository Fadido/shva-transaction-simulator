using Shva.Domain;

namespace Shva.Application.Dtos;

public record TransactionResponseDto(
    Guid Id,
    string Region,
    DateTime SubmittedAtUtc,
    DateTime LocalTime,
    string Status);

public static class TransactionResponseMapper
{
    public static TransactionResponseDto ToResponse(this Transaction t) => new(
        t.Id,
        t.Region,
        t.SubmittedAtUtc,
        t.LocalTime,
        t.Status.ToString());
}
