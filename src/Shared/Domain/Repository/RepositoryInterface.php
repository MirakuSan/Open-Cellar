<?php

declare(strict_types=1);

namespace App\Shared\Domain\Repository;

/**
 * @template T of object
 *
 * @extends \IteratorAggregate<array-key, T>
 */
interface RepositoryInterface extends \IteratorAggregate, \Countable
{
    /**
     * @return \Iterator<array-key, T>
     */
    public function getIterator(): \Iterator;

    public function count(): int;

    /**
     * @return PaginatorInterface<T>|null
     */
    public function paginator(): ?PaginatorInterface;

    /**
     * @return ($this is static ? static : RepositoryInterface<T>)
     */
    public function withPagination(int $page, int $itemsPerPage): static;

    /**
     * @return ($this is static ? static : RepositoryInterface<T>)
     */
    public function withoutPagination(): static;
}
