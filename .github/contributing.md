# Openfort React Contributing Guide

Hi! We're really excited that you are interested in contributing to Openfort React. Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

## Contributor Code of Conduct

As contributors and maintainers of this project, we pledge to respect all people who contribute through reporting issues, posting feature requests, updating documentation, submitting pull requests or patches, and other activities.

We are committed to making participation in this project a harassment-free experience for everyone, regardless of the level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, age, or religion.

Examples of unacceptable behavior by participants include the use of sexual language or imagery, derogatory comments or personal attacks, trolling, public or private harassment, insults, or other unprofessional conduct.

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct. Project maintainers who do not follow the Code of Conduct may be removed from the project team.

## Pull Request Guidelines

- Checkout a topic branch from the relevant branch, e.g. main, and merge back against that branch.

- If adding a new feature:
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:
  - Provide a detailed description of the bug in the PR. Live demo preferred.

- It's OK to have multiple small commits as you work on the PR - GitHub can automatically squash them before merging.

## Development Setup

You will need [pnpm](https://pnpm.io/)

After cloning the repo, run:

```bash
# install the dependencies of the project
$ pnpm install
# build openfort-react package and watch for changes
$ pnpm dev
# on another terminal, run the playground
$ pnpm dev:playground
```

### Other dev commands

#### Linting

To lint the codebase, run:

```bash
pnpm check
```

To automatically fix linting issues, run:

```bash
pnpm check:fix
```

Beware that committing code that does not pass linting checks is not allowed.

#### Upgrading the package version

Use changesets to bump the version and generate changelog entries:
Simply run:

```bash
pnpm changeset
```

And follow the interactive prompt to select the packages and version bumps.
