CREATE TABLE `Users` (
  `id` int(11) KEY NOT NULL AUTO_INCREMENT,
  `nickname` text,
  `email` varchar(255),
  `avatar` varchar(255),
  `emailVerified` bool,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `ModPacks` (
  `id` int(11) KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255),
  `gameVersion` varchar(10),
  `loaderType` enum('vanilla','forge', 'fabric', 'quilt'),
  `loaderVersion` varchar(10),
  `idUser` int NOT NULL,
  `created_at` timestamp,
  `updated_at` timestamp
);



CREATE TABLE `Category` (
  `id` int(11) KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(10) UNIQUE,
  `displayName` varchar(100)
);


CREATE TABLE `ModpacksCategory` (
  `id` int(11) KEY NOT NULL AUTO_INCREMENT,
  `idModpack` int,
  `idCategory` int
);

ALTER TABLE `ModPacks` ADD FOREIGN KEY (`idUser`) REFERENCES `Users` (`id`);
ALTER TABLE `ModpacksCategory` ADD FOREIGN KEY (`idModpack`) REFERENCES `ModPacks` (`id`);
ALTER TABLE `ModpacksCategory` ADD FOREIGN KEY (`idCategory`) REFERENCES `ModPacks` (`id`);