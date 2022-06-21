export type PacResponse = {
  version: 2;
  limit: 250;
  valid: true;
  results:
    | {
        pkgname: string;
        pkgbase: string;
        repo: string;
        arch: string;
        pkgver: string;
        pkgrel: string;
        epoch: numbee;
        pkgdesc: string;
        url: URL;
        filename: string;
        compressed_size: number;
        installed_size: number;
        build_date: string;
        last_update: string;
        flag_date: null | string;
        maintainers: string[];
        packager: string;
        groups: string[] | [];
        licenses: string[];
        conflicts: string[] | [];
        provides: string[] | [];
        replaces: string[] | [];
        depends: string[];
        optdepends: string[] | [];
        makedepends: string[] | [];
        checkdepends: string[] | [];
      }[]
    | [];
  num_pages: number;
  page: number;
};
