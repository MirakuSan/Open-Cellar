<?php

declare(strict_types=1);

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return static function (RoutingConfigurator $routes): void {
    $routes->import('@LiveComponentBundle/config/routes.php')
        ->prefix('/_components')
        // adjust prefix to add localization to your components
        // ->prefix('/{_locale}/_components')
    ;
};
