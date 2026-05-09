using Shva.Application.Dtos;

namespace Shva.Application;

public interface ITransactionService
{
    Task<TransactionResponseDto> SubmitAsync(string userId, TransactionRequestDto request, CancellationToken ct = default);
    Task<IReadOnlyList<TransactionResponseDto>> GetApprovedAsync(string userId, CancellationToken ct = default);
}
