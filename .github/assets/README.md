# Encrypted deployment assets

`audt-fonts.tar.gz.gpg` contains the generated TWK Lausanne Pan WOFF files used
by `docs.audt.work`. The archive is symmetrically encrypted with OpenPGP and
AES-256 and can only be opened with the `AUDT_FONT_ARCHIVE_KEY` GitHub Actions
secret.

The production workflow decrypts the archive into `public/audt-fonts/` before
building. Plaintext font files remain ignored and must never be committed.

To rotate the archive after changing the licensed source fonts:

1. Run `AUDT_TWK_WEBFONT_LICENSE_CONFIRMED=1 pnpm run fonts`.
2. Create a new random archive key and update the `AUDT_FONT_ARCHIVE_KEY`
   repository secret.
3. Archive `public/audt-fonts/` and encrypt it with the parameters used by the
   production workflow.
4. Verify a local decrypt and build before committing the encrypted archive.
