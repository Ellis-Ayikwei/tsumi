# Contributing to Tsumi

Thank you for considering contributing to Tsumi! This document outlines the process and guidelines.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

## Development Workflow

### Branching Strategy
- `main` – Production-ready code
- `develop` – Integration branch
- `feature/*` – New features
- `bugfix/*` – Bug fixes
- `hotfix/*` – Urgent production fixes

### Commit Messages
Follow conventional commits:
```
feat: Add user wallet dashboard
fix: Resolve errand assignment bug
docs: Update API documentation
chore: Update dependencies
```

### Code Style

**Python (Django)**
- Follow PEP 8
- Use Black for formatting
- Maximum line length: 100

**TypeScript/JavaScript**
- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable names

**Flutter/Dart**
- Follow Dart style guide
- Use `flutter format`

## Testing

### Before Submitting PR
```bash
# Run all tests
npm run test

# Python tests
cd apps/backend-py && python manage.py test

# Linting
npm run lint
```

### Test Coverage
- Aim for 80%+ coverage
- Write unit tests for business logic
- Write integration tests for API endpoints

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

### PR Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows style guidelines
- [ ] No linting errors
- [ ] All CI checks pass

## Issue Reporting

### Bug Reports
Include:
- Description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, versions)
- Screenshots (if applicable)

### Feature Requests
Include:
- Problem description
- Proposed solution
- Alternative solutions
- Additional context

## Questions?

Open a discussion in GitHub Discussions or reach out to maintainers.


