<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;
use Twig\TemplateWrapper;

/* themes/custom/talovi_theme/templates/page.html.twig */
class __TwigTemplate_937d25978317e39380245b67a61b7161 extends Template
{
    private Source $source;
    /**
     * @var array<string, Template>
     */
    private array $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
        $this->sandbox = $this->extensions[SandboxExtension::class];
        $this->checkSecurity();
    }

    protected function doDisplay(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 9
        yield "<div class=\"layout-container\">

  <header class=\"talovi-header\" role=\"banner\">
    <a class=\"talovi-logo\" href=\"";
        // line 12
        yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar($this->extensions['Drupal\Core\Template\TwigExtension']->getPath("<front>"));
        yield "\" rel=\"home\">
      <svg class=\"talovi-logo-icon\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">
        <path d=\"M16 2L28 9V23L16 30L4 23V9L16 2Z\" fill=\"#534AB7\"/>
        <rect x=\"10\" y=\"10\" width=\"12\" height=\"2.5\" rx=\"1.25\" fill=\"#ffffff\"/>
        <rect x=\"14.75\" y=\"12.5\" width=\"2.5\" height=\"8\" rx=\"1.25\" fill=\"#ffffff\"/>
      </svg>
      <span class=\"talovi-logo-text\">Talovi</span>
    </a>

    <nav class=\"talovi-nav\" role=\"navigation\" aria-label=\"";
        // line 21
        yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Main navigation"));
        yield "\">
      <ul>
        <li><a href=\"/\">";
        // line 23
        yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Home"));
        yield "</a></li>
        <li><a href=\"/docs/getting-started\">";
        // line 24
        yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Docs"));
        yield "</a></li>
        <li><a href=\"/blog\">";
        // line 25
        yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Blog"));
        yield "</a></li>
        <li><a href=\"https://github.com/Talovi/talovi\" target=\"_blank\" rel=\"noopener noreferrer\">";
        // line 26
        yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("GitHub"));
        yield "</a></li>
        <li><a href=\"/getting-started\" class=\"btn-nav-primary\">";
        // line 27
        yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Get started"));
        yield "</a></li>
      </ul>
    </nav>

    <button class=\"hamburger\" aria-label=\"";
        // line 31
        yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Toggle menu"));
        yield "\" aria-expanded=\"false\">
      <span class=\"hamburger-bar\"></span>
      <span class=\"hamburger-bar\"></span>
      <span class=\"hamburger-bar\"></span>
    </button>
  </header>

  <section class=\"talovi-hero\">
    <div class=\"hero-glow\" aria-hidden=\"true\"></div>
    <div class=\"hero-inner\">
      <h1>";
        // line 41
        yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("AI for everyone."));
        yield "</h1>
      <p>";
        // line 42
        yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Open source framework powering small businesses and disadvantaged developers worldwide."));
        yield "</p>
      <div class=\"hero-ctas\">
        <a href=\"/docs/getting-started\" class=\"btn-primary\">";
        // line 44
        yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Get started"));
        yield "</a>
        <a href=\"https://github.com/Talovi/talovi\" class=\"btn-outline\" target=\"_blank\" rel=\"noopener noreferrer\">";
        // line 45
        yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("View on GitHub"));
        yield "</a>
      </div>
    </div>
  </section>

  <main id=\"main-content\" class=\"main-content\" role=\"main\">
    <div class=\"container\">
      <div class=\"layout-content";
        // line 52
        if ((($tmp = CoreExtension::getAttribute($this->env, $this->source, ($context["page"] ?? null), "sidebar", [], "any", false, false, true, 52)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            yield " has-sidebar";
        }
        yield "\">
        <div class=\"content-area\">
          ";
        // line 54
        yield $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, CoreExtension::getAttribute($this->env, $this->source, ($context["page"] ?? null), "content", [], "any", false, false, true, 54), "html", null, true);
        yield "
        </div>
        ";
        // line 56
        if ((($tmp = CoreExtension::getAttribute($this->env, $this->source, ($context["page"] ?? null), "sidebar", [], "any", false, false, true, 56)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            // line 57
            yield "          <aside class=\"layout-sidebar\" role=\"complementary\">
            ";
            // line 58
            yield $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, CoreExtension::getAttribute($this->env, $this->source, ($context["page"] ?? null), "sidebar", [], "any", false, false, true, 58), "html", null, true);
            yield "
          </aside>
        ";
        }
        // line 61
        yield "      </div>
    </div>
  </main>

  <footer class=\"site-footer\" role=\"contentinfo\">
    <div class=\"container footer-inner\">
      ";
        // line 67
        if ((($tmp = CoreExtension::getAttribute($this->env, $this->source, ($context["page"] ?? null), "footer", [], "any", false, false, true, 67)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            // line 68
            yield "        ";
            yield $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, CoreExtension::getAttribute($this->env, $this->source, ($context["page"] ?? null), "footer", [], "any", false, false, true, 68), "html", null, true);
            yield "
      ";
        } else {
            // line 70
            yield "        <div class=\"footer-grid\">
          <div class=\"footer-col\">
            <h4 class=\"footer-heading\">";
            // line 72
            yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("About Talovi"));
            yield "</h4>
            <p class=\"footer-text\">";
            // line 73
            yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Open source AI framework built for developers who believe technology should be accessible to everyone."));
            yield "</p>
          </div>
          <div class=\"footer-col\">
            <h4 class=\"footer-heading\">";
            // line 76
            yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Links"));
            yield "</h4>
            <ul class=\"footer-links\">
              <li><a href=\"/docs\">";
            // line 78
            yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Documentation"));
            yield "</a></li>
              <li><a href=\"/community\">";
            // line 79
            yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Community"));
            yield "</a></li>
              <li><a href=\"https://github.com/Talovi/talovi\" target=\"_blank\" rel=\"noopener noreferrer\">";
            // line 80
            yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("GitHub"));
            yield "</a></li>
              <li><a href=\"/license\">";
            // line 81
            yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("License"));
            yield "</a></li>
            </ul>
          </div>
          <div class=\"footer-col\">
            <h4 class=\"footer-heading\">";
            // line 85
            yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("By ITLasso"));
            yield "</h4>
            <p class=\"footer-text\">";
            // line 86
            yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Built and maintained by ITLasso. Empowering communities through open technology."));
            yield "</p>
            <a href=\"https://itlasso.com\" class=\"footer-link-external\" target=\"_blank\" rel=\"noopener noreferrer\">itlasso.com</a>
          </div>
        </div>
        <div class=\"footer-bottom\">
          <p class=\"footer-copy\">";
            // line 91
            yield $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("Talovi — MIT License — by ITLasso"));
            yield "</p>
        </div>
      ";
        }
        // line 94
        yield "    </div>
  </footer>

</div>";
        $this->env->getExtension('\Drupal\Core\Template\TwigExtension')
            ->checkDeprecations($context, ["page"]);        yield from [];
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName(): string
    {
        return "themes/custom/talovi_theme/templates/page.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable(): bool
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo(): array
    {
        return array (  220 => 94,  214 => 91,  206 => 86,  202 => 85,  195 => 81,  191 => 80,  187 => 79,  183 => 78,  178 => 76,  172 => 73,  168 => 72,  164 => 70,  158 => 68,  156 => 67,  148 => 61,  142 => 58,  139 => 57,  137 => 56,  132 => 54,  125 => 52,  115 => 45,  111 => 44,  106 => 42,  102 => 41,  89 => 31,  82 => 27,  78 => 26,  74 => 25,  70 => 24,  66 => 23,  61 => 21,  49 => 12,  44 => 9,);
    }

    public function getSourceContext(): Source
    {
        return new Source("", "themes/custom/talovi_theme/templates/page.html.twig", "/var/www/html/web/themes/custom/talovi_theme/templates/page.html.twig");
    }
    
    public function checkSecurity()
    {
        static $tags = ["if" => 52];
        static $filters = ["t" => 21, "escape" => 54];
        static $functions = ["path" => 12];

        try {
            $this->sandbox->checkSecurity(
                ['if'],
                ['t', 'escape'],
                ['path'],
                $this->source
            );
        } catch (SecurityError $e) {
            $e->setSourceContext($this->source);

            if ($e instanceof SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

    }
}
