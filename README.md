# ECC to Cursor Plugin Workflow

This repository converts upstream ECC assets into a Cursor local plugin package.

## GitHub automation

The workflow file `.github/workflows/release-cursor-plugin.yml` supports:

1. Pulling the latest ECC repository.
2. Converting ECC assets into Cursor plugin format (`dst`).
3. Packaging the converted plugin into a zip.
4. Publishing that zip as a GitHub Release asset.

## How to run

1. Push this repository to GitHub.
2. Open **Actions**.
3. Run **Build and Release Cursor Plugin**.
4. Optionally set:
  - `ecc_repo`: upstream ECC repository URL
  - `source_dir`: clone destination (default `src/everything-claude-code`)
  - `destination_dir`: conversion output (default `dst`)
  - `publish_release`: whether to create a release
  - `release_tag`: custom release tag

If `release_tag` is empty, the workflow auto-generates one.

## Install plugin from release

1. Download the release zip asset.
2. Extract the zip into `.cursor/plugin/local/<plugin-name>/`.
3. Restart Cursor and enable the local plugin.

