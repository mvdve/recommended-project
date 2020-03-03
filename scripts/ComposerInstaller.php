<?php

namespace RecommendedProject;

use Composer\Script\Event;

/**
 * Class ComposerInstaller
 *
 * @package RecommendedProject
 */
class ComposerInstaller {
  public static function createFiles(Event $event) {
    $folders = [
      'public/config/sync',
      'development/assets/js',
      'development/assets/scss'
    ];

    foreach ($folders as $folder) {
      if (!file_exists($folder)) {
        mkdir($folder, 0744, true);
      }
    }

    $files = [
      'public/web/sites/default/default.settings.php' => 'public/web/sites/default/settings.php',
      'public/web/sites/default/default.services.yml' => 'public/web/sites/default/services.yml',
      'public/web/sites/example.settings.local.php' => 'public/web/sites/default/settings.local.php'
    ];

    foreach ($files as $original => $destination) {
      if (!file_exists($destination)) {
        copy($original, $destination);
      }
    }
  }
}
