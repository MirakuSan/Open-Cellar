<?php

declare(strict_types=1);

use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

return static function (ContainerConfigurator $containerConfigurator): void {
    $containerConfigurator->extension('api_platform', [
        'title' => 'Open Cellar API',
        'version' => '0.1',
        'defaults' => [
            'stateless' => true,
            'cache_headers' => [
                'vary' => ['Content-Type', 'Authorization', 'Origin'],
            ],
        ],
        'mapping' => [
            'paths' => [
                '%kernel.project_dir%/src/Cellar/Infrastructure/ApiPlatform/Resource/',
            ],
        ],
        'formats' => [
            'json' => ['application/json'],
            'jsonld' => ['application/ld+json'],
        ],
        'patch_formats' => [
            'json' => ['application/merge-patch+json'],
        ],
        'swagger' => [
            'versions' => [3],
        ],
        'exception_to_status' => [
            // TODO
            // We must trigger the API Platform validator before the data transforming.
            // Let's create an API Platform PR to update the AbstractItemNormalizer.
            // In that way, this exception won't be raised anymore as payload will be validated (see DiscountBookPayload).
            InvalidArgumentException::class => 422,
        ],
    ]);
};
